-- Create triggers to automatically log activities when patents, news, events, or service requests are created/updated/deleted

-- Function to log patent activities
CREATE OR REPLACE FUNCTION public.log_patent_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'technology',
      'added',
      NEW.title,
      'New patent/technology added',
      jsonb_build_object('patent_id', NEW.id, 'status', NEW.status, 'field', NEW.field)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'technology',
      'updated',
      NEW.title,
      'Patent/technology updated',
      jsonb_build_object('patent_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'technology',
      'deleted',
      OLD.title,
      'Patent/technology deleted',
      jsonb_build_object('patent_id', OLD.id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to log news activities
CREATE OR REPLACE FUNCTION public.log_news_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'news',
      'created',
      NEW.title,
      'News article created',
      jsonb_build_object('news_id', NEW.id, 'category', NEW.category, 'status', NEW.status)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if status changed to published
    IF NEW.status = 'Published' AND OLD.status != 'Published' THEN
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'news',
        'published',
        NEW.title,
        'News article published',
        jsonb_build_object('news_id', NEW.id, 'category', NEW.category)
      );
    ELSIF NEW.status != OLD.status THEN
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'news',
        'updated',
        NEW.title,
        'News article status updated to ' || NEW.status,
        jsonb_build_object('news_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
      );
    ELSE
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'news',
        'updated',
        NEW.title,
        'News article updated',
        jsonb_build_object('news_id', NEW.id, 'category', NEW.category)
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'news',
      'deleted',
      OLD.title,
      'News article deleted',
      jsonb_build_object('news_id', OLD.id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to log event activities
CREATE OR REPLACE FUNCTION public.log_event_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'event',
      'created',
      NEW.title,
      'New event created',
      jsonb_build_object('event_id', NEW.id, 'type', NEW.type, 'date', NEW.date)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'event',
      'updated',
      NEW.title,
      'Event updated',
      jsonb_build_object('event_id', NEW.id, 'type', NEW.type)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'event',
      'deleted',
      OLD.title,
      'Event deleted',
      jsonb_build_object('event_id', OLD.id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to log service request activities
CREATE OR REPLACE FUNCTION public.log_service_request_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'service',
      'received',
      NEW.service_title,
      'New service request from ' || NEW.name,
      jsonb_build_object('request_id', NEW.id, 'service_type', NEW.service_type, 'organization', NEW.organization)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status != OLD.status THEN
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'service',
        'updated',
        NEW.service_title,
        'Service request status changed to ' || NEW.status,
        jsonb_build_object('request_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trg_patent_activity ON public.admin_patents;
CREATE TRIGGER trg_patent_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_patents
  FOR EACH ROW EXECUTE FUNCTION public.log_patent_activity();

DROP TRIGGER IF EXISTS trg_news_activity ON public.admin_news;
CREATE TRIGGER trg_news_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_news
  FOR EACH ROW EXECUTE FUNCTION public.log_news_activity();

DROP TRIGGER IF EXISTS trg_event_activity ON public.admin_events;
CREATE TRIGGER trg_event_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_events
  FOR EACH ROW EXECUTE FUNCTION public.log_event_activity();

DROP TRIGGER IF EXISTS trg_service_request_activity ON public.admin_service_requests;
CREATE TRIGGER trg_service_request_activity
  AFTER INSERT OR UPDATE ON public.admin_service_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_service_request_activity();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.log_patent_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_news_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_event_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_service_request_activity() TO authenticated;

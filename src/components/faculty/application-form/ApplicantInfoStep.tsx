import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Info } from "lucide-react";

export function ApplicantInfoStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Primary Applicant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicant_name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="applicant_name"
                {...register("applicant_name", { required: "Full name is required" })}
                placeholder="e.g., Dr. Juan Dela Cruz"
                className={errors.applicant_name ? "border-red-500" : ""}
              />
              {errors.applicant_name && (
                <p className="text-sm text-red-500">{errors.applicant_name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicant_nationality">
                Nationality <span className="text-red-500">*</span>
              </Label>
              <Input
                id="applicant_nationality"
                {...register("applicant_nationality", { required: "Nationality is required" })}
                placeholder="e.g., Filipino"
                className={errors.applicant_nationality ? "border-red-500" : ""}
              />
              {errors.applicant_nationality && (
                <p className="text-sm text-red-500">{errors.applicant_nationality.message as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicant_address">
              Complete Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="applicant_address"
              {...register("applicant_address", { required: "Address is required" })}
              placeholder="Enter your complete address"
              className={errors.applicant_address ? "border-red-500" : ""}
              rows={3}
            />
            {errors.applicant_address && (
              <p className="text-sm text-red-500">{errors.applicant_address.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicant_contact">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="applicant_contact"
                {...register("applicant_contact", { required: "Contact number is required" })}
                placeholder="e.g., +63 912 345 6789"
                className={errors.applicant_contact ? "border-red-500" : ""}
              />
              {errors.applicant_contact && (
                <p className="text-sm text-red-500">{errors.applicant_contact.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicant_email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="applicant_email"
                type="email"
                {...register("applicant_email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="e.g., juan.delacruz@ustp.edu.ph"
                className={errors.applicant_email ? "border-red-500" : ""}
              />
              {errors.applicant_email && (
                <p className="text-sm text-red-500">{errors.applicant_email.message as string}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            Co-Inventors (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Tagging Co-Inventors</AlertTitle>
            <AlertDescription className="text-blue-700">
              Co-inventors can be tagged using their <span className="font-medium">@ustp.edu.ph</span> email.
              In-app notifications for tagged faculty will activate once USTP institutional
              accounts are fully enabled.
            </AlertDescription>
          </Alert>
          <p className="text-sm text-gray-600 mb-4">
            Add co-inventors who contributed to this invention. You can add multiple co-inventors.
          </p>
          <CoInventorsList />
        </CardContent>
      </Card>
    </div>
  );
}

function CoInventorsList() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const coInventors = watch("co_inventors") || [];

  const addCoInventor = () => {
    setValue("co_inventors", [
      ...coInventors,
      { name: "", email: "", contact_number: "", address: "", nationality: "", contribution: "" }
    ]);
  };

  const removeCoInventor = (index: number) => {
    const updated = [...coInventors];
    updated.splice(index, 1);
    setValue("co_inventors", updated);
  };

  const coInventorErrors = (errors.co_inventors || []) as any[];

  return (
    <div className="space-y-4">
      {coInventors.map((_: unknown, index: number) => {
        const emailError = coInventorErrors?.[index]?.email?.message as string | undefined;
        return (
          <div key={index} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">Co-Inventor #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeCoInventor(index)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register(`co_inventors.${index}.name`)}
                placeholder="Full Name"
              />
              <Input
                {...register(`co_inventors.${index}.nationality`)}
                placeholder="Nationality"
              />
              <div className="space-y-1">
                <Input
                  type="email"
                  {...register(`co_inventors.${index}.email`, {
                    validate: (value: string) => {
                      if (!value) return true; // optional at field level; form-level handles requirement
                      return /@ustp\.edu\.ph$/i.test(value.trim()) ||
                        "Must be a valid @ustp.edu.ph email";
                    }
                  })}
                  placeholder="USTP Email (e.g., jane.doe@ustp.edu.ph)"
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                  <p className="text-xs text-red-500">{emailError}</p>
                )}
              </div>
              <Input
                {...register(`co_inventors.${index}.contact_number`)}
                placeholder="Contact Number (optional)"
              />
              <Input
                {...register(`co_inventors.${index}.address`)}
                placeholder="Address"
                className="md:col-span-2"
              />
              <Textarea
                {...register(`co_inventors.${index}.contribution`)}
                placeholder="Contribution to the invention"
                className="md:col-span-2"
                rows={2}
              />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCoInventor}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Co-Inventor
      </button>
    </div>
  );
}

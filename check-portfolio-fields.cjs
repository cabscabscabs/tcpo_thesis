const { Client } = require('pg');

// Database connection configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 54322,
});

async function checkPortfolioFields() {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to database successfully');

    // Get the column names from portfolio_items table
    const columnsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'portfolio_items' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Available columns in portfolio_items table:');
    columnsResult.rows.forEach(row => {
      console.log(`  ${row.column_name} (${row.data_type})`);
    });
    
    // Test querying for the water purification system with all fields
    const slug = 'water-purification-system';
    console.log(`\nQuerying for technology with slug: ${slug}`);
    
    const query = `
      SELECT * FROM public.portfolio_items 
      WHERE slug = $1 AND published = true
      LIMIT 1;
    `;
    
    const result = await client.query(query, [slug]);
    
    if (result.rows.length > 0) {
      console.log('\nActual data in database:');
      const data = result.rows[0];
      for (const [key, value] of Object.entries(data)) {
        if (value !== null) {
          console.log(`  ${key}: ${value}`);
        }
      }
    } else {
      console.log('Technology not found');
    }
    
  } catch (error) {
    console.error('Error checking portfolio fields:', error);
  } finally {
    await client.end();
  }
}

checkPortfolioFields();
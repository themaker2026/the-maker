const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://cnunlbjhzcxmhftysqbu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNudW5sYmpoemN4bWhmdHlzcWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjE4MjQsImV4cCI6MjA5MDYzNzgyNH0.jaW3e6-Ole1zw6P4wukdy1UAV1M51IlKmQ9btFuVVqY"
);

async function run() {
  const { data, error } = await supabase.from('products').select('*').eq('slug', 'eagle-key-ring');
  if (data && data.length > 0) {
     console.log('Images:', data[0].images);
     const url = data[0].images?.[0];
     if (url) {
        console.log('URL:', url);
        const res = await fetch(url);
        console.log('Fetch status:', res.status, res.statusText);
        const text = await res.text();
        console.log('Response body:', text.slice(0, 200));
     }
  } else {
     console.log('Not found or error:', error);
  }
}

run().then(() => process.exit(0));

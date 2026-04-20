const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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

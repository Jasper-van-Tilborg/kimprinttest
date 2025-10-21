import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://haayawapdamodcidksim.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYXlhd2FwZGFtb2RjaWRrc2ltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQxMTk2NSwiZXhwIjoyMDc1OTg3OTY1fQ.bE_rHeCuoyfTMs0y4SK512mUgmqp4Pr6_h6jjnxvTJ4'

export const supabase = createClient(supabaseUrl, supabaseKey)

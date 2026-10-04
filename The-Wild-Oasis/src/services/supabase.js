import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://evjyeahlahfknnjvvdcm.supabase.co";
const supabaseKey = "sb_publishable_mBLk65vJzBGEu1ajng4Erg_eD6Poa4s";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

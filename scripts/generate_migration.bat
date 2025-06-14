@echo off
set "timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%%time:~0,2%%time:~3,2%%time:~6,2%"
set "timestamp=%timestamp: =0%"
supabase db diff --schema public > supabase\migrations\%timestamp%_update_products_table.sql
echo Migration script generated: supabase\migrations\%timestamp%_update_products_table.sql
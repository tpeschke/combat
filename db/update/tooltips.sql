update cctooltips set 
save_field = $1,
back_to_fields = $2,
reset_count = $3,
auto_clock_stop = $4,
auto_clock_one = $5,
auto_clock_two = $6,
decrement_second = $7,
increment_second = $8,
status_description = $9,
hidden = $10,
wound_category_tier = $11,
stress_from_wounds = $12,
stress_threshold = $13,
jump_to_current_second = $14,
trauma_fighter = $15,
trauma_fail = $16,
kill_fighter = $17,
edit_fighter = $18,
save_fighter = $19,
resurrect_fighter = $20,
remove_fighter = $21
where userid = $22;
module.exports = {
    // Save Field
    save_field: false
    // Back to Fields
    , back_to_fields: false
    // Reset Count
    , reset_count: false
    // Stop Auto-Clock
    , auto_clock_stop: false
    // Auto-Clock +1 Sec/Sec
    , auto_clock_one: false
    // Auto-Clock +1 Sec/.5 Sec
    , auto_clock_two: false
    // Decrement Second
    , decrement_second: false
    // Increment Second
    , increment_second: false
    // Status Description Helper
    , status_description: false
    // Hidden
    , hidden: false
    // Wound Category Tier
    , wound_category_tier: false
    // Stress From Wounds
    , stress_from_wounds: false
    // Stress Threshold
    , stress_threshold: false
    // Jump to Current Second
    , jump_to_current_second: false
    // Trauma Fighter
    , trauma_fighter: false
    // Trauma, Fail Amount
    , trauma_fail: false
    // Kill Fighter
    , kill_fighter: false
    // Edit Fighter
    , edit_fighter: false
    // Save Fighter
    , save_fighter: false
    // Resurrect Fighter
    , resurrect_fighter: false
    // Remove Fighter
    , remove_fighter: false,
    updateTooltipSettings(toolTip, value) {
        this[toolTip] = value
        //send to db
    }
}
Update weapons
set 
    combatant = $1,
    weapon = $2,
    selected = $3,
    speed = $4,
    encumb = $5, 
    atk = $6, 
    init = $7, 
    def = $8, 
    dr = $9, 
    shield_dr = $10, 
    measure = $11, 
    damage = $12, 
    parry = $13, 
    weapontype = $14
where 
    id = $15
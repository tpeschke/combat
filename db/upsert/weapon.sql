insert into weapons (combatant, weapon, selected, speed, fatigue, atk, 
                    init, def, dr, shield_dr, measure, damage, 
                    parry, weapontype, id, damagetype, cover)
values ($1, $2, $3, $4, $5, $6, 
        $7, $8, $9, $10, $11, $12, 
        $13, $14, $15, $16, $17)
On CONFLICT (id)
DO Update
set combatant = $1, weapon = $2, selected = $3, speed = $4, fatigue = $5, atk = $6, 
    init = $7, def = $8, dr = $9, shield_dr = $10, measure = $11, damage = $12, 
    parry = $13, weapontype = $14, damagetype = $16, cover = $17
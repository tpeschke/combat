select id, weapon, selected, speed, encumb, atk, init, def, dr, shield_dr, measure, damage, parry, weapontype from weapons
where combatant = $1
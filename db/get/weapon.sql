select weapons.id, weapon, selected, speed, encumb, atk, init, def, dr, shield_dr, measure, damage, parry, maxrange, fatigue, damagetype, cover from weapons
left join ccranges on ccranges.weaponid = weapons.id
where combatant = $1
order by weapon
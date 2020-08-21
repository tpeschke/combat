delete from combatants
where id = $1;

delete from weapons
where combatant = $1;
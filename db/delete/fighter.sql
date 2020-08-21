delete from combatants
where id = $1

select * from weapons
where combatant = $1;
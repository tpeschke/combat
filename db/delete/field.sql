delete from weapons
where combatant in (select id from combatants where idcombat = $1);

delete from combatants
where idcombat = $1;

delete from statuses
where idcombat = $1;

delete from combat
where id = $1;
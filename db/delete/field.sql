delete from weapons w
join combatants c on c.id = w.combatant
where idcombat = $1;

delete from combatants
where idcombat = $1;

delete from statuses
where idcombat = $1;

delete from combat
where id = $1;
delete from combatants
where idcombat = $1;

delete from statuses
where idcombat = $1;

delete from combat
where id = $1;

select namecombat, sum(DISTINCT countnum) as countnum, count(DISTINCT namefighter) as fighternum, sum(cast(dead as INT)) as deadnum, sum(DISTINCT combat.id) id  from combat
full join combatants on combatants.idcombat = combat.id
where iduser = $2
group by namecombat
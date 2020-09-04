select namecombat as name, max(countnum) as count, count(namefighter) as fightercount, sum(cast(dead as INT)) as deadcount, sum(distinct combat.id) id, urlhash as hash from combat
full join combatants on combatants.idcombat = combat.id
where iduser = $1
group by namecombat, urlhash
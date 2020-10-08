select combat.id, namecombat as name, countnum as count, combat.urlhash as hash, encounterhash from combat
left join encounterhash as e on e.urlhash = combat.urlhash
where encounterhash = $1
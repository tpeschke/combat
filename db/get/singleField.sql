select id, namecombat as name, countnum as count, combat.urlhash as hash, encounterhash from combat
left join encounterhash as e on e.urlhash = combat.urlhash
where iduser = $1 and urlhash = $2
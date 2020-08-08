select id, namecombat as name, countnum as count, urlhash as hash from combat
where iduser = $1 and urlhash = $2
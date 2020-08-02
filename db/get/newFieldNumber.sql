select count(namecombat) as count from combat
where namecombat like 'New Battlefield%' and idUser = $1

insert into combat (idUser, namecombat, urlhash, countnum)
  values ($1, $2, $3, $4)
ON CONFLICT (urlhash)
DO Update
  set countNum = $4, namecombat = $2
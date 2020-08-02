    insert into combat (nameCombat, countNum, idUser, urlhash)
values 
     ($1,0,$2, $3);
    
    select id, nameCombat, urlhash from combat
where nameCombat = $1 and idUser = $2
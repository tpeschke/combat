insert into statuses (namestatus, timestatus, description, colorcode, 
                    playerdescription, playerview, id, idcombat)
values ($1, $2, $3, $4, 
        $5, $6, $7, $8)
ON CONFLICT (id)
DO update
set namestatus = $1, timestatus = $2, description = $3, colorcode = $4, 
    playerdescription = $5, playerview = $6
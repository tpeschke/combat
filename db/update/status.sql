Update statuses
set namestatus = $1, timestatus = $2, description = $3, colorcode = $4, playerdescription = $5
where id = $6;
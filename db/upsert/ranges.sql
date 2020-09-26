insert into ccranges (weaponid, maxrange)
values ($1, $2)
ON CONFLICT (weaponid)
DO update
set weaponid = $1, maxrange = $2
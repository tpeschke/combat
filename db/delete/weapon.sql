delete from weapons
where id = $1;

delete from ccranges
where weaponid = $1;
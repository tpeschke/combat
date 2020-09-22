select statuses.id as id, namestatus, timestatus, playerDescription, playerview from statuses
join combat on statuses.idcombat = combat.id
where urlhash = $1 and playerview is true
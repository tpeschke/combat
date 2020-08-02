select statuses.id as id, namestatus, timestatus from statuses
join combat on statuses.idcombat = combat.id
where urlhash = $1
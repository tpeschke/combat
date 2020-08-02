select combatants.id as id, namefighter, colorcode, topcheck, dead, hidden, (health * 100/max_health) as health_percent, panic, broken, stress, stressthrold from combatants
join combat on combatants.idcombat = combat.id
where urlhash = $1;
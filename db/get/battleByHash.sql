select combatants.id as id, namefighter, colorcode, topcheck, dead, hidden, panic, broken, 
case 
    when health * 100/max_health = 100 then ''
    when health * 100/max_health > 75 then '75'
    when health * 100/max_health > 50 then '50'
    when health * 100/max_health > 25 then '25'
    when health * 100/max_health > 0 then '10'
    when health * 100/max_health = 0 then '00'
end as wound,
case 
    when stress * 100/stressthreshold = 100 then ''
    when stress * 100/stressthreshold > 75 then '75'
    when stress * 100/stressthreshold > 50 then '50'
    when stress * 100/stressthreshold > 25 then '25'
    when stress * 100/stressthreshold > 0 then '10'
    when stress * 100/stressthreshold = 0 then '00'
end as stress,
from combatants
join combat on combatants.idcombat = combat.id
where urlhash = $1;
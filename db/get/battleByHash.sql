select combatants.id as id, namefighter, colorcode, topcheck, dead, hidden, panic, broken, stress, 
case 
    when health * 100/max_health = 100 then ''
    when health * 100/max_health > 75 then '75'
    when health * 100/max_health > 50 then '50'
    when health * 100/max_health > 25 then '25'
    when health * 100/max_health > 0 then '10'
    when health * 100/max_health = 0 then '00'
end as wound,
case when stressthreshold > 0 then (stress * 100/stressthreshold) else 0 end as stress
from combatants
join combat on combatants.idcombat = combat.id
where urlhash = $1;
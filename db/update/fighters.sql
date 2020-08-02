Update combatants
set 
    namefighter = $1, 
    colorcode = $2, 
    actioncount = $3, 
    topcheck = $4, 
    acting = $5, 
    dead = $6,
    hidden = $7,
    max_health = $8,
    health = $9,
    stress = $10,
    panic = $11,
    broken = $12,
    stressthreshold = $13
where 
    id = $14

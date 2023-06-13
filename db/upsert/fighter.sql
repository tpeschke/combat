insert into combatants (namefighter, colorcode, actioncount, topcheck, acting, 
                        dead, hidden, max_health, health, stress, 
                        panic, stressthreshold, caution, id, idcombat, fatigue)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
On CONFLICT (id)
DO Update
set 
    namefighter = $1, colorcode = $2, actioncount = $3, topcheck = $4, acting = $5, dead = $6,
    hidden = $7, max_health = $8, health = $9, stress = $10, panic = $11, stressthreshold = $12, caution = $13, fatigue = $16
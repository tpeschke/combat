create table usersAuth (
    id SERIAL PRIMARY KEY,
    auth0 TEXT,
    img Text,
    username VARCHAR(40),
    tooltip bit,
    theme VARCHAR(1),
    gl varchar(10),
    cc varchar(10)
    );


--     insert into usersauth (auth0)
-- values ('adsgfhaoibjmoi5wrhgiuaosfngiuasdhg;ioarhdgv;ou')
    

    create table combat (
    id SERIAL PRIMARY KEY,
    nameCombat VARCHAR(40),
    countNum INT,
    idUser Int,
        FOREIGN Key (idUser) REFERENCES usersAuth(id)
    )

-- insert into combat (namecombat, iduser, countNum)
-- values ('Battle of Minas Tirith', 1, 0),
-- ('Pellinor Fields', 1, 10),
-- (Siege of Troy, 1, 3)
    

create table combatants (
    id SERIAL PRIMARY KEY,
    namefighter VARCHAR(40),
    colorCode VarChar(10),
    topcheck BIT,
    actionCount INT,
    acting bit,
    dead bit,
    init VARCHAR(10),
    hidden bit,
    idCombat Int,
        FOREIGN Key (idCombat) REFERENCES combat(id)
    )

--     insert into combatants (namefighter, colorcode, topcheck, acting, dead, idcombat, actionCount)
-- values 
--      ('Ragnar','#FF0000', '0', '0', '0',1, 1),
--      ('Sir William','#FFFF00','0', '0', '0',1, 15)
--      ('Robert','#FF00FF', '0', '0', '0', 2, 2),
--      ('Urlich VonLichstein','#FFFFFF', '0', '0', '0', 2, 3),
--      ('Harris', '#000000','0', '0', '1', 1, 2)

create table weapons (
    id SERIAL PRIMARY KEY,
    combatant Int,
    weapon VARCHAR(40),
    selected BIT,
    speed Int
)

--     insert into weapons (combatant, weapon, speed, selected)
-- values 
--      (1, 'unarmed', 10, '0'),
--      (1, 'longsword', 10, '1'),
--      (2, 'dagger', 7, '1'),
--      (3, 'pike', 18, '1')


create table statuses (
    id SERIAL PRIMARY KEY,
    namestatus VARCHAR(40),
    timestatus Int,
    idCombat Int,
        FOREIGN Key (idCombat) REFERENCES combat(id)
    )

--     insert into statuses (namestatus, timestatus, idcombat)
-- values 
--      ('Darkness', 16, 1),
--      ('Fire', 12, 1)
--      ('Darkness', 25, 2)
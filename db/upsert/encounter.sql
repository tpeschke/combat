insert into encounterhash (urlhash, encounterhash)
  values ($1, $2)
ON CONFLICT (encounterhash)
DO NOTHING
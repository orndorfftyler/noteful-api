-- TRUNCATE all tables to ensure that there are no
-- data in them so we start with a fresh set of data
TRUNCATE folder, note RESTART IDENTITY CASCADE;

INSERT INTO folder (uuid, folder_name)
VALUES
    ('b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1','Important'),
    ('b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1','Super'),
    ('b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1', 'Spangley');

INSERT INTO note (folder_uuid, uuid, note_name, modified, content)
VALUES
    ('b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', 'cbc787a0-ffaf-11e8-8eb2-f2801f1b9fd1','Dogs', '2019-01-03T00:00:00.000Z', 'Corporis accusamus placeat quas non voluptas. Harum fugit molestias qui.'),
    ('b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1', 'd26e0034-ffaf-11e8-8eb2-f2801f1b9fd1','Cats', '2018-08-15T23:00:00.000Z', 'Eos laudantium quia ab blanditiis temporibus necessitatibus.' ),
    ('b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1', 'd26e01a6-ffaf-11e8-8eb2-f2801f1b9fd1', 'Pigs', '2018-03-01T00:00:00.000Z', 'Occaecati dignissimos quam qui facere deserunt quia.');
  
UPDATE note SET folder_id = 1 WHERE id = 1;
UPDATE note SET folder_id = 2 WHERE id = 2;
UPDATE note SET folder_id = 3 WHERE id = 3;


-- ============================================================
-- BASE PRINCIPALE : comptes des étudiants DataQuest
-- ============================================================

CREATE TABLE IF NOT EXISTS utilisateurs (
    id                SERIAL PRIMARY KEY,
    nom               VARCHAR(100) NOT NULL,
    email             VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    xp                INTEGER DEFAULT 0,
    niveau            VARCHAR(50) DEFAULT 'Apprenti',
    nb_requetes       INTEGER DEFAULT 0,
    telephone         VARCHAR(20) DEFAULT '',
    module_depart     VARCHAR(50) DEFAULT 'SQL',
    streak_count      INTEGER DEFAULT 0,
    derniere_connexion TIMESTAMP DEFAULT NOW(),
    date_inscription  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- BASE PÉDAGOGIQUE : Boutique en ligne (données fictives)
-- ============================================================

CREATE TABLE IF NOT EXISTS clients (
    id              SERIAL PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL,
    email           VARCHAR(150),
    ville           VARCHAR(100),
    date_inscription DATE
);

CREATE TABLE IF NOT EXISTS produits (
    id        SERIAL PRIMARY KEY,
    nom       VARCHAR(150) NOT NULL,
    categorie VARCHAR(100),
    prix      DECIMAL(10,2),
    stock     INTEGER
);

CREATE TABLE IF NOT EXISTS commandes (
    id             SERIAL PRIMARY KEY,
    client_id      INTEGER REFERENCES clients(id),
    date_commande  DATE,
    total          DECIMAL(10,2),
    statut         VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS details_commande (
    id            SERIAL PRIMARY KEY,
    commande_id   INTEGER REFERENCES commandes(id),
    produit_id    INTEGER REFERENCES produits(id),
    quantite      INTEGER,
    prix_unitaire DECIMAL(10,2)
);

-- ============================================================
-- DONNÉES FICTIVES
-- ============================================================

INSERT INTO clients (nom, email, ville, date_inscription) VALUES
('Ahmed Benali',    'ahmed@email.com',   'Casablanca', '2024-01-15'),
('Sara Alaoui',     'sara@email.com',    'Rabat',      '2024-02-20'),
('Karim Tazi',      'karim@email.com',   'Marrakech',  '2024-03-10'),
('Fatima Idrissi',  'fatima@email.com',  'Fès',        '2024-04-05'),
('Omar Chraibi',    'omar@email.com',    'Tanger',     '2024-05-18');

INSERT INTO produits (nom, categorie, prix, stock) VALUES
('Smartphone Samsung A54',     'Électronique', 3500.00,  25),
('Laptop Lenovo IdeaPad',      'Informatique', 8900.00,  12),
('Casque Sony WH-1000XM5',     'Audio',        2200.00,  30),
('Tablette iPad 10',           'Électronique', 6500.00,   8),
('Souris Logitech MX Master',  'Informatique',  650.00,  50),
('Clavier mécanique Keychron', 'Informatique', 1200.00,  20),
('Montre connectée Apple Watch','Wearable',    4800.00,  15);

INSERT INTO commandes (client_id, date_commande, total, statut) VALUES
(1, '2024-06-01', 3500.00, 'Livré'),
(2, '2024-06-05', 9550.00, 'En cours'),
(1, '2024-06-10', 2200.00, 'Livré'),
(3, '2024-06-12', 6500.00, 'En attente'),
(4, '2024-06-15', 1850.00, 'Livré'),
(5, '2024-06-20', 8900.00, 'En cours');

INSERT INTO details_commande (commande_id, produit_id, quantite, prix_unitaire) VALUES
(1, 1, 1, 3500.00),
(2, 2, 1, 8900.00),
(2, 5, 1,  650.00),
(3, 3, 1, 2200.00),
(4, 4, 1, 6500.00),
(5, 5, 1,  650.00),
(5, 6, 1, 1200.00),
(6, 2, 1, 8900.00);

-- ============================================================
-- UTILISATEUR LECTURE SEULE pour les requêtes des étudiants
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'etudiant') THEN
        CREATE ROLE etudiant WITH LOGIN PASSWORD 'etudiant123';
    END IF;
END
$$;

GRANT SELECT ON clients, produits, commandes, details_commande TO etudiant;

-- ============================================================
-- GAMIFICATION : colonne nb_requetes + table badges utilisateurs
-- ============================================================

ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS nb_requetes INTEGER DEFAULT 0;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS telephone VARCHAR(20) DEFAULT '';
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS module_depart VARCHAR(50) DEFAULT 'SQL';
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS derniere_connexion TIMESTAMP DEFAULT NOW();

CREATE TABLE IF NOT EXISTS utilisateur_badges (
    id        SERIAL PRIMARY KEY,
    user_id   INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    badge_id  VARCHAR(50) NOT NULL,
    obtenu_le TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ============================================================
-- ADAPTIVE LEARNING : performances + missions générées par IA
-- ============================================================

CREATE TABLE IF NOT EXISTS performances (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    concept    VARCHAR(50) NOT NULL,
    reussi     BOOLEAN NOT NULL,
    requete    TEXT,
    monde      INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS missions (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
    monde       INTEGER NOT NULL,
    titre       VARCHAR(200),
    scenario    TEXT,
    question    TEXT,
    sql_attendu TEXT,
    concept     VARCHAR(50),
    complete    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

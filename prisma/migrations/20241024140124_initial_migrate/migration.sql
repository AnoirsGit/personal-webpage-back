-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "jobTitle" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "countryName" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "countryCode" VARCHAR(10) NOT NULL,
    "continentName" VARCHAR(255) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "linkedinUrl" VARCHAR(255) NOT NULL,
    "telegramUrl" VARCHAR(255) NOT NULL,
    "telegramTag" VARCHAR(255) NOT NULL,
    "githubUrl" VARCHAR(255) NOT NULL,
    "githubTag" VARCHAR(255) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionsContent" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "md_text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionsContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillTree" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "SkillTree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "isNode" BOOLEAN NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" TEXT NOT NULL,
    "treeId" TEXT NOT NULL,
    "sourceNodeId" VARCHAR(255) NOT NULL,
    "targetNodeId" VARCHAR(255) NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "color" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "place" VARCHAR(255) NOT NULL,
    "baseDescription" TEXT NOT NULL,
    "skills" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceCard" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "variant" INTEGER NOT NULL,
    "imageUrls" TEXT[],
    "linkSrc" VARCHAR(255),
    "linkLabel" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_userId_key" ON "Contacts"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "SkillTree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "SkillTree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceCard" ADD CONSTRAINT "ExperienceCard_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import { prisma } from '../config/database';
import { experienceSeed } from './seeds/experience';
import { treeSeed } from './seeds/tree';
import { locationSeed } from './seeds/locations';

// Seed Experiences
const seedExperience = async () => {
  for (const experience of experienceSeed) {
    const { cards, ...experienceData } = experience;

    const createdExperience = await prisma.experience.create({
      data: {
        ...experienceData,
        startDate: experience.startDate,
        endDate: experience.endDate,
      },
    });

    // Seed associated experience cards
    for (const card of cards) {
      await prisma.experienceCard.create({
        data: {
          ...card,
          experienceId: createdExperience.id,
        },
      });
    }
  }
}

// Seed SkillTree, Nodes, and Edges
const seedSkillTree = async () => {
  for (const [treeTitle, treeContent] of Object.entries(treeSeed)) {
    // Create SkillTree
    const createdSkillTree = await prisma.skillTree.create({
      data: { title: treeTitle },
    });

    // Seed Nodes
    const nodeMap = new Map<string, string>(); // Map to store nodes and their new IDs
    for (const node of treeContent.nodes) {
      const createdNode = await prisma.node.create({
        data: {
          treeId: createdSkillTree.id,
          title: node.title,
          description: node.description || null,
          isNode: node.isNode,
          tags: node.tags,
          positionX: node.position.x,
          positionY: node.position.y,
        },
      });
      nodeMap.set(node.id + '', createdNode.id); // Map original ID to created Node ID
    }

    // Seed Edges
    for (const edge of treeContent.edges) {
      const sourceNodeId = nodeMap.get(edge.sourceNodeId + '');
      const targetNodeId = nodeMap.get(edge.targetNodeId + '');

      if (sourceNodeId && targetNodeId) {
        await prisma.edge.create({
          data: {
            treeId: createdSkillTree.id,
            sourceNodeId,
            targetNodeId,
          },
        });
      }
    }
  }
};


const seedLocations = async () => {
  for (const location of locationSeed) {
    await prisma.location.create({
      data: location,
    });
  }
};

async function main() {
  // await seedExperience();
  // await seedSkillTree();
  await seedLocations();
}

main()
  .catch((e) => {
    console.error("Error seeding experience data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
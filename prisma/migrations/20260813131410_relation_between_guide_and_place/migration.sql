-- CreateTable
CREATE TABLE "_GuideToPlace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GuideToPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GuideToPlace_B_index" ON "_GuideToPlace"("B");

-- AddForeignKey
ALTER TABLE "_GuideToPlace" ADD CONSTRAINT "_GuideToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuideToPlace" ADD CONSTRAINT "_GuideToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

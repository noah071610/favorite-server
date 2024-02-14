-- CreateTable
CREATE TABLE "LikePost" (
    "postId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LikePost_pkey" PRIMARY KEY ("postId")
);

-- AddForeignKey
ALTER TABLE "LikePost" ADD CONSTRAINT "LikePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

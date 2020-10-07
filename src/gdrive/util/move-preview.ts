import { getUserAndContentFolderIds } from './get-user-and-content-folder-ids';

export const movePreviewToUnsigned = async (auth, args) => {

  const userFolder = getUserAndContentFolderIds(auth, args.searchTerm, args.checkValue);

}

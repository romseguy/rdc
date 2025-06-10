export const BackButton = ({ onClick, ...props }) => (
  <button type="button" onClick={onClick} {...props}>
    {"<"} Retour
  </button>
);

export const AddNoteButton = ({ book, setBook, ...props }) => {
  return (
    <button
      disabled={!!book?.notes?.find(({ isNew }) => isNew)}
      onClick={() => {
        const id = book?.notes?.length + 1;
        setBook({
          ...book,
          notes: book.notes?.concat([
            {
              id: id.toString(),
              isEditing: true,
              isNew: true,
            },
          ]),
        });
      }}
      {...props}
    >
      Ajouter une citation
    </button>
  );
};

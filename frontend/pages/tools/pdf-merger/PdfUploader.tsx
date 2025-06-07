import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface UploadedFile {
  id: string;
  file: File;
}

interface PdfUploaderProps {
  onFilesChange: (files: File[]) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    onFilesChange(files.map(f => f.file));
  }, [files, onFilesChange]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newFiles = Array.from(files);
    const [moved] = newFiles.splice(result.source.index, 1);
    newFiles.splice(result.destination.index, 0, moved);
    setFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <input type="file" multiple accept="application/pdf" onChange={onFileChange} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-pdf-list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: 0,
                marginTop: 16,
                listStyle: 'none',
                maxHeight: 300,
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: 4,
              }}
            >
              {files.map((file, index) => (
                <Draggable key={file.id} draggableId={file.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: 12,
                        marginBottom: 8,
                        backgroundColor: snapshot.isDragging ? '#90caf9' : '#e3f2fd',
                        borderRadius: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'grab',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span>{file.file.name}</span>
                      <button
                        onClick={() => removeFile(file.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: 18,
                          cursor: 'pointer',
                        }}
                        aria-label={`Remove ${file.file.name}`}
                      >
                        &times;
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PdfUploader;

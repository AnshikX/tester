import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

const UndoRedoContext = createContext();
const PushChangesContext = createContext();

export const UndoRedoProvider = ({ children }) => {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const undidChanges = useRef(false);
  const reDidChanges = useRef(false);
  const sequenceRef = useRef(0);

  const pushChanges = useCallback((changeDetails) => {
    console.log("Push changes called", changeDetails)
    changeDetails.sequence = sequenceRef.current;
    console.log(undidChanges.current);

    if (undidChanges.current) {

      setTimeout(() => {
        undidChanges.current = false;
      }, 0);

      setRedoStack((prev) => [...prev, changeDetails]);
    } else {
      setUndoStack((prevStack) => [...prevStack, changeDetails]);
      if(!reDidChanges.current){
        setTimeout(() => {
          reDidChanges.current = false
        },0)
        setRedoStack([])
      }
    }
  }, []);
  
  const undoChanges = useCallback(() => {
    undidChanges.current = true;

    setUndoStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;

      const newStack = [...prevStack];
      const changeDetails = newStack.pop();
      changeDetails.doChanges();
      console.log(changeDetails);

      while (
        newStack.length > 0 &&
        newStack[newStack.length - 1].sequence === changeDetails.sequence
      ) {
        const groupedChange = newStack.pop();
        console.log(groupedChange);

        groupedChange.doChanges();
      }
      return newStack;
    });
  }, []);

  const redoChanges = useCallback(() => {
    setRedoStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;

      const newStack = [...prevStack];
      const changeDetails = newStack.pop();
      changeDetails.doChanges();

      while (
        newStack.length > 0 &&
        newStack[newStack.length - 1].sequence === changeDetails.sequence
      ) {
        const groupedChange = newStack.pop();
        groupedChange.doChanges();
      }
      return newStack;
    });
    reDidChanges.current = true;
  }, []);

  sequenceRef.current = sequenceRef.current + 1;

  return (
    <PushChangesContext.Provider value={{ pushChanges }}>
      <UndoRedoContext.Provider
        value={{ undoChanges, redoChanges, undoStack, redoStack }}
      >
        {children}
      </UndoRedoContext.Provider>
    </PushChangesContext.Provider>
  );
};

UndoRedoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUndoRedo = () => useContext(UndoRedoContext);
export const usePushChanges = () => useContext(PushChangesContext);

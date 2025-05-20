import React, { useState, useEffect, useRef } from 'react';
import useDesktopStore from '../../stores/desktopStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// --- Helper Functions for Formatting (copied from FileExplorer for now) ---
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (bytes === undefined || bytes === null) return '-'.padStart(9); // Pad for alignment
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; // Simplified list for terminal
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // Pad the formatted size string to align columns (e.g., 9 characters wide)
  return (parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).padStart(9);
}

function formatDate(date) {
  if (!date) return '-'.padEnd(17); // Pad for alignment
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date'.padEnd(17);
  // Format: YYYY-MM-DD HH:MM
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`.padEnd(17); // Pad for alignment
}

// --- Known Commands for Completion ---
const KNOWN_COMMANDS = [
  'help', 'clear', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'rm', 'mv', 'cp', 'echo'
];

function Terminal() {
  // Select state and actions individually
  const cwd = useDesktopStore((state) => state.cwd);
  const setCwd = useDesktopStore((state) => state.setCwd);
  const listDirectory = useDesktopStore((state) => state.listDirectory);
  const createDirectory = useDesktopStore((state) => state.createDirectory);
  const createFile = useDesktopStore((state) => state.createFile);
  const deleteItem = useDesktopStore((state) => state.deleteItem);
  const readFile = useDesktopStore((state) => state.readFile);
  const moveItem = useDesktopStore((state) => state.moveItem);
  const copyItem = useDesktopStore((state) => state.copyItem);

  const [history, setHistory] = useState([
    { type: 'info', text: 'Welcome to SimTerm! Type `help` for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastCompletion, setLastCompletion] = useState(null);
  const endOfHistoryRef = useRef(null);
  const inputRef = useRef(null);
  const historyContainerRef = useRef(null);

  // Smart Autoscroll Effect
  useEffect(() => {
    const container = historyContainerRef.current;
    if (!container) return;

    // Check if user is scrolled near the bottom before autoscrolling
    const threshold = 50; // Pixels from bottom
    const isScrolledNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    if (isScrolledNearBottom) {
        endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    // If not near bottom, don't scroll, let user read history

  }, [history]); // Run whenever history changes

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Helper to add output (used by showCompletionMatches)
  const addLinesToHistory = (lines) => {
     setHistory((prevHistory) => [...prevHistory, ...lines]);
  }

  // Helper function to display completion matches
  const showCompletionMatches = (matches) => {
    if (!matches || matches.length === 0) return;

    // Simple formatting: list matches, maybe wrap lines later
    const maxLineLength = 80; // Approximate width
    let currentLine = '';
    const outputLines = [];
    matches.sort().forEach((match, index) => {
        const nextSegment = match + (index === matches.length - 1 ? '' : '  '); // Add spacing
        if (currentLine.length + nextSegment.length > maxLineLength) {
            outputLines.push({ type: 'output', text: currentLine });
            currentLine = nextSegment;
        } else {
            currentLine += nextSegment;
        }
    });
    if (currentLine) {
        outputLines.push({ type: 'output', text: currentLine });
    }

    // Add the matches and then re-display the current prompt + input
    addLinesToHistory([
        ...outputLines,
        { type: 'prompt', text: `${cwd}$ ${input}` } // Re-display prompt
    ]);
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const fullCommand = input.trim();
      if (!fullCommand) return;

      const [command, ...args] = fullCommand.split(/\s+/);
      const output = [
        // { type: 'prompt', text: `${cwd}$ ${fullCommand}` } // Prompt is rendered differently now in history
      ];
      let commandProcessed = false;

      // Add command to history with limit
      if (fullCommand) {
         setCommandHistory(prev => {
            const updatedHistory = [...prev.filter(cmd => cmd !== fullCommand), fullCommand]; // Add, remove duplicates
            const historyLimit = 100; // Set command history limit
            if (updatedHistory.length > historyLimit) {
               return updatedHistory.slice(updatedHistory.length - historyLimit); // Keep only the last N commands
            }
            return updatedHistory;
         });
      }
      setHistoryIndex(-1); 
      setLastCompletion(null); 

      // Add the actual executed command line to the visual history
      addLinesToHistory([{ type: 'prompt', text: `${cwd}$ ${fullCommand}` }])

      // Helper to add output safely
      const addOutput = (msg, type = 'output') => {
        if (msg !== undefined && msg !== null) { // Allow empty strings for cat output
           // If msg is multi-line (e.g., from cat), split and add each line
           if (typeof msg === 'string' && msg.includes('\n')) {
              msg.split('\n').forEach(line => output.push({ type, text: line }));
           } else {
              output.push({ type, text: String(msg) }); // Ensure it's a string
           }
        }
      }
      const addErrorOutput = (msg) => addOutput(msg, 'error');

      switch (command) {
        case 'help':
          addOutput('Available commands:');
          addOutput('  help              - Show this help message');
          addOutput('  clear             - Clear the terminal screen');
          addOutput('  pwd               - Print working directory');
          addOutput('  ls [path]         - List directory contents');
          addOutput('  cd <path>         - Change directory');
          addOutput('  mkdir <path>      - Create directory');
          addOutput('  touch <path>      - Create empty file or update timestamp');
          addOutput('  cat <path>        - Display file content');
          addOutput('  rm <path>         - Remove file or empty directory');
          addOutput('  mv <source> <dest> - Move/rename file or directory');
          addOutput('  cp <source> <dest> - Copy file or directory');
          addOutput('  echo [...text]    - Print text to terminal');
          commandProcessed = true;
          break;
        
        case 'clear':
          setHistory([]);
          setInput('');
          return;

        case 'pwd':
          addOutput(cwd);
          commandProcessed = true;
          break;
        
        case 'ls': { 
          const targetPath = args[0]; 
          const result = listDirectory(targetPath); 
          if (result.success) {
            const items = result.data;
            if (Object.keys(items).length === 0) {
                 addOutput('(Directory is empty)');
            } else {
                // Sort items: directories first, then alphabetically
                const sortedNames = Object.keys(items).sort((a, b) => {
                  const itemA = items[a];
                  const itemB = items[b];
                  if (itemA.type !== itemB.type) {
                    return itemA.type === 'directory' ? -1 : 1;
                  }
                  return a.localeCompare(b);
                });

                // Add formatted output for each item
                sortedNames.forEach(name => {
                   const details = items[name];
                   const typeIndicator = details.type === 'directory' ? 'd' : '-';
                   const sizeFormatted = details.type === 'directory' ? '-'.padStart(9) : formatBytes(details.size);
                   const dateFormatted = formatDate(details.lastModified);
                   const displayName = details.type === 'directory' ? `${name}/` : name;
                   // Combine into a single line with spacing
                   addOutput(`${typeIndicator} ${dateFormatted} ${sizeFormatted} ${displayName}`);
                });
            }
          } else {
            addErrorOutput(result.error); 
          }
          commandProcessed = true;
          break;
        }

        case 'cd': {
          const targetPath = args[0];
          if (!targetPath) {
            addOutput('cd: missing operand');
          } else {
            const result = setCwd(targetPath); // Call store action
            if (!result.success) {
              addErrorOutput(result.error); // Use addErrorOutput
            }
            // CWD update is handled by store subscription
          }
          commandProcessed = true;
          break;
        }

        case 'mkdir': {
          const targetPath = args[0];
          if (!targetPath) {
            addOutput('mkdir: missing operand');
          } else {
            const result = createDirectory(targetPath); // Call store action
            if (!result.success) {
              addErrorOutput(result.error); // Use addErrorOutput
            } else {
              toast.success(`Created directory: ${targetPath}`);
            }
             // FileExplorer will update automatically due to fs subscription
          }
          commandProcessed = true;
          break;
        }
        
        case 'touch': {
          const targetPath = args[0];
          if (!targetPath) {
            addOutput('touch: missing operand');
          } else {
            const result = createFile(targetPath);
            if (!result.success) {
              addErrorOutput(result.error); // Use addErrorOutput
            } else {
              toast.success(`Touched file: ${targetPath}`);
            }
             // FileExplorer will update automatically
          }
          commandProcessed = true;
          break;
        }

        case 'echo':
          addOutput(args.join(' '));
          commandProcessed = true;
          break;

        case 'cat': {
           if (!args[0]) addOutput('cat: missing operand');
           else { 
               const result = readFile(args[0]);
               if (result.success) {
                   addOutput(result.data); // Use addOutput, it handles newlines
               } else {
                   addErrorOutput(result.error); // Use addErrorOutput
               }
           }
           commandProcessed = true; break;
        }
        case 'rm': {
           if (!args[0]) addOutput('rm: missing operand');
           else { 
               const result = deleteItem(args[0]); // Use existing deleteItem action
               if (!result.success) {
                   addErrorOutput(result.error); // Use addErrorOutput
               } else {
                   toast.success(`Removed: ${args[0]}`);
               }
                // Add confirmation/verbose message? (optional)
           }
           commandProcessed = true; break;
        }
        case 'mv': {
           if (args.length < 2) addOutput('mv: missing destination operand after source operand');
           else { 
               const source = args[0];
               const destination = args[1];
               const result = moveItem(source, destination);
               if (!result.success) {
                   addErrorOutput(result.error); // Use addErrorOutput
               } else {
                   toast.success(`Moved/Renamed ${source} to ${destination}`);
               }
           }
           commandProcessed = true; break;
        }
        case 'cp': {
           if (args.length < 2) {
               addOutput('cp: missing destination file operand after source operand');
           } else { 
               const source = args[0];
               const destination = args[1];
               const result = copyItem(source, destination);
               if (!result.success) {
                   addErrorOutput(result.error); // Use addErrorOutput
               } else {
                   toast.success(`Copied ${source} to ${destination}`);
               }
           }
           commandProcessed = true; break;
        }

        default:
          if (command) {
            addErrorOutput(`Command not found: ${command}`); // Use addErrorOutput
          }
          commandProcessed = true;
          break;
      }

      // Add command output to history (if any)
      if (commandProcessed && output.length > 0) { // Check output length > 0 now
         addLinesToHistory(output);
      }
      setInput('');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIndex = historyIndex === -1 
            ? commandHistory.length - 1 
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
        setLastCompletion(null); // Reset completion state on history nav
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        if (historyIndex === -1) return; // Already at current input
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === historyIndex && historyIndex === commandHistory.length - 1) {
            // If pressing down at the last command, clear input
            setHistoryIndex(-1);
            setInput('');
        } else {
             setHistoryIndex(newIndex);
             setInput(commandHistory[newIndex]);
        }
        setLastCompletion(null); // Reset completion state on history nav
    } else if (e.key === 'Tab') {
        e.preventDefault(); 
        
        const currentInput = input;
        const words = currentInput.trimStart().split(/\s+/); 
        const isTypingCommand = words.length === 1 && !currentInput.includes(' ', currentInput.length - words[0].length -1);
        const currentWord = words[words.length - 1] || ''; 

        if (currentWord === '') { 
            setLastCompletion(null); // Reset if tabbing on empty
            return; 
        }

        let matches = [];
        let sourceForCompletion = []; // Either commands or file/dir names
        let itemsData = null; // Store directory data for suffix check

        if (isTypingCommand) {
            // --- Try Command Completion ---
            sourceForCompletion = KNOWN_COMMANDS;
            matches = sourceForCompletion.filter(cmd => cmd.startsWith(currentWord));
        } else {
            // --- Try File/Directory Completion ---
            const listResult = listDirectory(cwd);
            if (listResult.success) {
               itemsData = listResult.data;
               sourceForCompletion = Object.keys(itemsData);
               matches = sourceForCompletion.filter(name => name.startsWith(currentWord));
            }
        }
        
        // --- Handle Matches ---
        if (matches.length === 1) {
            const match = matches[0];
            let suffix = ' '; // Default space
            if (!isTypingCommand && itemsData && itemsData[match]?.type === 'directory') {
                suffix = '/';
            }
            const baseInput = currentInput.substring(0, currentInput.lastIndexOf(currentWord)); 
            const completedInput = baseInput + match + suffix;
            setInput(completedInput);
            setLastCompletion(null); // Reset after successful single completion
        } else if (matches.length > 1) {
            // Find longest common prefix
            let prefix = matches[0];
            for (let i = 1; i < matches.length; i++) {
                while (sourceForCompletion[i].indexOf(prefix) !== 0) { // Use sourceForCompletion here
                    prefix = prefix.substring(0, prefix.length - 1);
                    if (prefix === '') break;
                }
                if (prefix === '') break;
            }

            if (prefix.length > currentWord.length) {
                // If prefix is longer, complete it
                const baseInput = currentInput.substring(0, currentInput.lastIndexOf(currentWord));
                const completedInput = baseInput + prefix;
                setInput(completedInput);
                // Don't reset lastCompletion, set it for potential double-tab
                setLastCompletion({ word: currentWord, matches, prefix });
            } else {
                // Prefix didn't get longer (or no common prefix)
                // Check for double-tab to show matches
                if (lastCompletion && lastCompletion.word === currentWord && lastCompletion.prefix === prefix) {
                    showCompletionMatches(matches);
                    setLastCompletion(null); // Reset after showing matches
                } else {
                    // First tab press with multiple matches, store info
                    setLastCompletion({ word: currentWord, matches, prefix });
                    // Optional: Play a beep sound here?
                }
            }
        } else {
           // No matches
           setLastCompletion(null); // Reset
        }
    }
  };

  // --- Focus Input on Click --- 
  const focusInput = () => inputRef.current?.focus();

  // Animation variants for new lines
  const lineVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  };

  return (
    <div 
      className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200 font-mono text-sm p-3 overflow-hidden terminal-container"
      onClick={focusInput}
    >
      <div 
         ref={historyContainerRef} 
         className="flex-grow overflow-y-auto mb-2 pr-2" 
         style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #1a202c' }} 
      >
        {history.map((line, index) => {
           const textColorClass = 
              line.type === 'prompt' ? 'text-cyan-400' : 
              line.type === 'error' ? 'text-red-500' :    
              line.type === 'info' ? 'text-yellow-400' : 
              'text-gray-200'; 

           // Wrap each line in motion.div for animation
           return (
            <motion.div 
               key={`${index}-${line.text.slice(0,10)}`}
               initial="hidden"
               animate="visible"
               variants={lineVariants}
               className={`mb-0.5 ${line.type !== 'prompt' ? textColorClass : ''}`}
            >
               {line.type === 'prompt' ? (
                  <>
                      <span className="text-cyan-400 select-none">{line.text.match(/^(.*)(\$\s.*)$/)?.[1] || cwd}</span>
                      <span className="text-gray-500 select-none">{line.text.match(/^(.*)(\$\s.*)$/)?.[2]?.split(' ')[0] || '$'}</span> 
                      <span className="text-gray-200 ml-1" style={{ whiteSpace: 'pre-wrap' }}>{line.text.match(/^(.*)(\$\s.*)$/)?.[2]?.substring(line.text.match(/^(.*)(\$\s.*)$/)?.[2]?.indexOf(' ') + 1) || ''}</span> 
                  </>
                ) : (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span> 
               )}
            </motion.div>
           );
        })}
        <div ref={endOfHistoryRef} /> 
      </div>
      <div className="flex flex-shrink-0 items-center"> 
        <span className="text-cyan-400 mr-1 select-none">{cwd}</span>
        <span className="text-gray-500 mr-1 select-none">$</span>
        <input 
          ref={inputRef} 
          id="terminal-input"
          type="text"
          className="flex-grow bg-transparent border-none outline-none text-gray-200 pl-1 caret-teal-300"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputSubmit}
          autoFocus
          spellCheck="false"
        />
      </div>
    </div>
  );
}

export default Terminal; 
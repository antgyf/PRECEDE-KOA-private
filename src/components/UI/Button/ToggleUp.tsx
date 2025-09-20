interface ToggleUpProps {
  onClose: () => void;
}

const ToggleUp: React.FC<ToggleUpProps> = ({ onClose }) => {
  return (
    <button
      className="btn btn-circle p-0 m-0 border-none bg-transparent"
      onClick={onClose}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Define the pattern */}
          <pattern
            id="pattern0_416_339"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use href="#image0_416_339" transform="scale(0.0111111)" />
          </pattern>
          {/* Define the image */}
          <image
            id="image0_416_339"
            width="90"
            height="90"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACQElEQVR4nO3bvWoUURiH8UdWjbFYsI2iVRq9gdiYdjtrt/HjBrwFCwUxam+nkMJaKy9BLNJpYalEjIpgISnUyMJMs2ST3Zl3ds6ZeX7wNoFkznnn45z/7AYkSZIkSZIkSZIkSZKkelaBLWCvqK3iZwq0BrwFDqZqB7hkp2NsALuHNLmsydW9abPruQH8PqLJZe0Dd2z24gbAwzkaPF3PgFMVjtdLQ+BVhSaX9QY41/YkUrcOvK/R5LI+AlfankyqRsDPgCaX9Qu43vakUnMX+BPY5LL+AfeAE/TcCvC8gQZP10vgLD21NiOENFW9DDcbx4SQpqpX4eZmETCqNutvUVV/f3LsW3TYoGIIOWwnEbFD6WS4GdYMIeXe+PLUnvtDzb/ZqXCzHhBCZjVkcgJfB5zA7MPNMm7xQeAjqZchZH/BN3LjOd/0dSbcRISQPeBaS9vGLMJNRAjZAS4mMIZkw01KV9NK0F21mesnIQdLfj4ue51oTA4r/ij3cNNECGlKtuGmyRDSlOzCTc634iCDR12nFpdxoos3J4HtmlfCbrEFTMXVgO3odtGbMA9qDugdcJ70XCjGVmdu9yMH9KnDkfYM8KLG/D5HDiap51iC60+Yvrx2HFXcUYVJMYSkFG7C9O2joeGC4SbMvCEkdKvTskXCTZjjQshtums8R7gJ8z2TENJkuPkyowffIg/0JKMQsuxw8yjyIKeBp8VZ/VE0vo//EbVa9GHSg6/A4y5+CUeSJEmSJEmSJEmSJEmSxFH+A7ObxlHI9xqzAAAAAElFTkSuQmCC"
          />
        </defs>
        {/* Apply the pattern */}
        <rect width="90" height="90" fill="url(#pattern0_416_339)" />
      </svg>
    </button>
  );
};

export default ToggleUp;

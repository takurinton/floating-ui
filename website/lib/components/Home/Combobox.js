import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import classNames from 'classnames';
import {useId} from 'react';
import {forwardRef, useRef, useState} from 'react';

const fruits = [
  'Alfalfa Sprouts',
  'Apple',
  'Apricot',
  'Artichoke',
  'Asian Pear',
  'Asparagus',
  'Atemoya',
  'Avocado',
  'Bamboo Shoots',
  'Banana',
  'Bean Sprouts',
  'Beans',
  'Beets',
  'Belgian Endive',
  'Bell Peppers',
  'Bitter Melon',
  'Blackberries',
  'Blueberries',
  'Bok Choy',
  'Boniato',
  'Boysenberries',
  'Broccoflower',
  'Broccoli',
  'Brussels Sprouts',
  'Cabbage',
  'Cactus Pear',
  'Cantaloupe',
  'Carambola',
  'Carrots',
  'Casaba Melon',
  'Cauliflower',
  'Celery',
  'Chayote',
  'Cherimoya',
  'Cherries',
  'Coconuts',
  'Collard Greens',
  'Corn',
  'Cranberries',
  'Cucumber',
  'Dates',
  'Dried Plums',
  'Eggplant',
  'Endive',
  'Escarole',
  'Feijoa',
  'Fennel',
  'Figs',
  'Garlic',
  'Gooseberries',
  'Grapefruit',
  'Grapes',
  'Green Beans',
  'Green Onions',
  'Greens',
  'Guava',
  'Hominy',
  'Honeydew Melon',
  'Horned Melon',
  'Iceberg Lettuce',
  'Jerusalem Artichoke',
  'Jicama',
  'Kale',
  'Kiwifruit',
  'Kohlrabi',
  'Kumquat',
  'Leeks',
  'Lemons',
  'Lettuce',
  'Lima Beans',
  'Limes',
  'Longan',
  'Loquat',
  'Lychee',
  'Madarins',
  'Malanga',
  'Mandarin Oranges',
  'Mangos',
  'Mulberries',
  'Mushrooms',
  'Napa',
  'Nectarines',
  'Okra',
  'Onion',
  'Oranges',
  'Papayas',
  'Parsnip',
  'Passion Fruit',
  'Peaches',
  'Pears',
  'Peas',
  'Peppers',
  'Persimmons',
  'Pineapple',
  'Plantains',
  'Plums',
  'Pomegranate',
  'Potatoes',
  'Prickly Pear',
  'Prunes',
  'Pummelo',
  'Pumpkin',
  'Quince',
  'Radicchio',
  'Radishes',
  'Raisins',
  'Raspberries',
  'Red Cabbage',
  'Rhubarb',
  'Romaine Lettuce',
  'Rutabaga',
  'Shallots',
  'Snow Peas',
  'Spinach',
  'Sprouts',
  'Squash',
  'Strawberries',
  'String Beans',
  'Sweet Potato',
  'Tangelo',
  'Tangerines',
  'Tomatillo',
  'Tomato',
  'Turnip',
  'Ugli Fruit',
  'Water Chestnuts',
  'Watercress',
  'Watermelon',
  'Waxed Beans',
  'Yams',
  'Yellow Squash',
  'Yuca/Cassava',
  'Zucchini Squash',
];

const Item = forwardRef(({children, active, ...rest}, ref) => {
  const id = useId();
  return (
    <div
      ref={ref}
      className={classNames(
        'cursor-default scroll-my-1 rounded-md p-2',
        {
          'bg-blue-500 text-white': active,
        }
      )}
      role="option"
      id={id}
      aria-selected={active}
      {...rest}
    >
      {children}
    </div>
  );
});

export function ComboboxDemo() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const listRef = useRef([]);

  const {x, y, strategy, context, refs} = useFloating({
    open,
    whileElementsMounted: autoUpdate,
    onOpenChange: setOpen,
    middleware: [
      offset(5),
      size({
        apply({rects, elements, availableHeight}) {
          const viewportHeight =
            window.visualViewport.height ??
            document.documentElement.clientHeight;

          Object.assign(elements.floating.style, {
            maxHeight: `${
              viewportHeight < availableHeight
                ? viewportHeight
                : Math.max(
                    availableHeight,
                    Math.min(200, viewportHeight)
                  )
            }px`,
            width: `${rects.reference.width}px`,
          });
        },
        padding: 25,
      }),
      flip({
        padding: 25,
        fallbackStrategy: 'initialPlacement',
      }),
    ],
  });

  const role = useRole(context, {role: 'listbox'});
  const dismiss = useDismiss(context);
  const navigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
    allowEscape: true,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} =
    useInteractions([role, dismiss, navigation]);

  function onChange(event) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  const items = fruits.filter((item) =>
    item.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  return (
    <>
      <input
        ref={refs.setReference}
        value={inputValue}
        className="rounded border-2 border-gray-300 p-2 outline-none focus:border-blue-500 dark:border-gray-500 dark:bg-gray-600/50"
        placeholder="Enter balloon flavor"
        aria-autocomplete="list"
        aria-labelledby={
          open && items.length === 0
            ? 'combobox-no-results'
            : undefined
        }
        {...getReferenceProps({
          onChange,
          onKeyDown(event) {
            if (
              event.key === 'Enter' &&
              activeIndex != null &&
              items[activeIndex]
            ) {
              setInputValue(items[activeIndex]);
              setActiveIndex(null);
              setOpen(false);
            }
          },
        })}
      />
      {open && (
        <FloatingFocusManager
          context={context}
          initialFocus={-1}
          visuallyHiddenDismiss
        >
          <div
            ref={refs.setFloating}
            className="z-10 max-h-[20rem] overflow-y-auto rounded-lg border border-slate-900/5 bg-white/80 bg-clip-padding p-1 text-left shadow-lg outline-none backdrop-blur-lg dark:bg-gray-600/80"
            {...getFloatingProps({
              style: {
                position: strategy,
                left: x ?? 0,
                top: y ?? 0,
              },
            })}
          >
            {items.length === 0 && (
              <p
                className="m-2"
                id="combobox-no-results"
                role="region"
                aria-atomic="true"
                aria-live="assertive"
              >
                No flavors found.
              </p>
            )}
            {items.map((item, index) => (
              <Item
                {...getItemProps({
                  key: item,
                  ref(node) {
                    listRef.current[index] = node;
                  },
                  onClick() {
                    setInputValue(item);
                    setOpen(false);
                    refs.domReference.current?.focus();
                  },
                })}
                active={activeIndex === index}
              >
                {item}
              </Item>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

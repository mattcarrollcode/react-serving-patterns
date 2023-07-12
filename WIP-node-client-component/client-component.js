"use client";

function ClientComponent() {
	"use client";
	const [count, setCount] = React.useState(0);

	function handleClick() {
		setCount(count + 1);
	}

	return React.createElement(
		"button",
		{ onClick: handleClick },
		"You pressed me ",
		count,
		" times"
	);
}

exports.ClientComponent = ClientComponent;

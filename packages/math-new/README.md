# Overview
The Balancer SOR Economics Extension is a package designed to extend the functionality of the Balancer SOR package. This extension introduces essential economics concepts, such as price impact and effective price calculations, into the package.

# Package Structure
The package is structured around a main Automated Market Maker (AMM) class that serves as the central point of interaction for users. The main components of the package are:

- AMM Class: The AMM class incorporates all the economic functions related to the Balancer SOR pools. It provides methods to calculate price impact, effective price, and other economic indicators for trades.

- SOR Extended Pool Classes: The package uses the Balancer SOR Pool classes as attributes in the AMM class. These classes from the Balancer SOR pools package handle the core functionality of interacting with Balancer SOR pools. Usually, we need to add a few functions on the SOR package (as an spot price function). Those functions should use Balancer SOR code as reference or even copied.

Note: In the context of this package, symbols are used to represent tokens, allowing both real tokens with addresses and imaginary tokens used in the dashboard environment to be handled seamlessly. This is particularly useful when dealing with the dashboard that supports imaginary tokens. Each extended pool class must handle this.

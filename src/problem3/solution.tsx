  interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
  }

  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }
  
  class Datasource {
    // Data source class retrieves the prices
    private sourceUrl: string;

    constructor(url: string) {
      this.sourceUrl = url;
    }

    // helper function to retrieve the prices
    async getPrices() {
      try {
        const response = await fetch(this.sourceUrl);

        if (!response.ok) {
          throw new Error("Could not fetch prices: ${response.status}");
        }
        const priceData = await response.json();

        return priceData;

      } catch (err) {
        throw new Error("Could not fetch prices: ${err}");
      }
    }
  }

  interface Props extends BoxProps {
  
  }

  const WalletPage: React.FC<Props> = (props: Props) => {
    // separates children property from the rest of the properties
    const { children, ...rest } = props;
    // ISSUE: useWalletBalances() function not defined
    const balances = useWalletBalances();
    const [prices, setPrices] = useState({});
  
    useEffect(() => {
      const datasource = new Datasource("https://interview.switcheo.com/prices.json");
      datasource.getPrices().then(prices => {
        setPrices(prices);
      }).catch(error => {
        // console.error instead of console.err
        console.error(error);
      });
    }, []);

    const priorities = {"Osmosis": 100, "Ethereum": 50, "Arbitrum": 30, "Ziliqa": 20, "Neo": 20};

    // returns priority of the blockchain
    // Inefficiency: can convert it to a dictionary instead, the same thing can be done for loading future dynamic values
    const getPriority = (blockchain: any): number => {
      const priority =  priorities[blockchain];
      
      return priority || -99;
    }
    
    //caches the result of the computation, doesnt need to be recomputed unless there is a change in dependencies
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            // ISSUE: wallet balance has no blockchain attribute
            const balancePriority = getPriority(balance.blockchain);
            // ISSUE: lhsPriority used but not declared -- it is undefined, should be balancePriority
            if (balancePriority > -99) {
               if (balance.amount <= 0) {
                 return true;
               }
            }
            return false;
          }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            // compare between every pair of WalletBalances
              const leftPriority = getPriority(lhs.blockchain);
              const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
              // higher priority is put at the front of the list
              return -1;
            } else if (rightPriority > leftPriority) {
              return 1;
            }
      });
    }, [balances, prices]);
  
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      // clone all original proprties of the balance object but add formatted so now the type is FormattedWalletBalance
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    })
    
    // ISSUE: should be formattedBalances
    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      // ASSUMPTION: WalletRow component is defined in somewhere in another file
      return (
        <WalletRow 
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    })
  
    return (
      // we want to remove the children property from props
      <div {...rest}>
        {rows}
      </div>
    )
  }